// Info de los modulos
#include <linux/module.h>
// Info del kernel en tiempo real
#include <linux/kernel.h>
#include <linux/sched.h>

#include <linux/cred.h> // Necesario para la macro from_kuid

// Headers para modulos
#include <linux/init.h>
// Header necesario para proc_fs
#include <linux/proc_fs.h>
// Para dar acceso al usuario
#include <asm/uaccess.h>
// Para manejar el directorio /proc
#include <linux/seq_file.h>
// Para get_mm_rss
#include <linux/mm.h>

struct task_struct *cpu; // Estructura que almacena info del cpu

// Almacena los procesos
struct list_head *lstProcess;
// Estructura que almacena info de los procesos hijos
struct task_struct *child;
struct list_head *tmp2;
unsigned long rss;

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de CPU para el Lab de Sopes 1");
MODULE_AUTHOR("HBran");

static int escribir_archivo(struct seq_file *archivo, void *v) {

	int total_procs = 0, proc_count = 0;
    	struct task_struct *p;

    	for_each_process(p) {
        	total_procs++;
    	}

	seq_printf(archivo, "{\n");
	seq_printf(archivo, "\t\"procesos\": [\n");
    for_each_process(cpu) {
    	proc_count++;
    	seq_printf(archivo, "\t\t{\n");
        seq_printf(archivo, "\t\t\"PID\": \"%d\",\n", cpu->pid);
        seq_printf(archivo, "\t\t\"name\": \"%s\",\n", cpu->comm);
        seq_printf(archivo, "\t\t\"state\":\"%d\",\n", cpu->__state);

        if (cpu->mm) {
            rss = get_mm_rss(cpu->mm) << PAGE_SHIFT;
            seq_printf(archivo, "\t\t\"memory\":\"%lu\",\n", rss);
        } else {
            seq_printf(archivo, "\t\t\"memory\":\"%s\",\n", "");
        }
        
        seq_printf(archivo, "\t\t\"userid\": \"%u\",\n", from_kuid(&init_user_ns, cpu->cred->user->uid));
	seq_printf(archivo, "\t\t\"hijos\": [\n");
        
        list_for_each(lstProcess, &(cpu->children)) {
            child = list_entry(lstProcess, struct task_struct, sibling);
            
            seq_printf(archivo, "\t\t\t{\n");
            seq_printf(archivo, "\t\t\t\"PID\": \"%d\",\n", child->pid);
            seq_printf(archivo, "\t\t\t\"name\": \"%s\",\n", child->comm);
            seq_printf(archivo, "\t\t\t\"state\":\"%d\",\n", child->__state);

             if (child->mm) {
                rss = get_mm_rss(child->mm) << PAGE_SHIFT;
                seq_printf(archivo, "\t\t\t\"memory\":\"%lu\",\n", rss);
            } else {
                seq_printf(archivo, "\t\t\t\"memory\":\"%s\",\n", "");
            }

            seq_printf(archivo, "\t\t\t\"userid\": \"%u\",\n", from_kuid(&init_user_ns, child->cred->user->uid));
            seq_printf(archivo, "\t\t\t\"hijos\": []\n");
            
            tmp2 = lstProcess->next;
    		if (tmp2 != &(cpu->children)) {
        		seq_printf(archivo, "\t\t\t},\n");
    		} else {
        		seq_printf(archivo, "\t\t\t}\n");
    		}
        }
        seq_printf(archivo, "\t\t]\n");
        if (proc_count == total_procs) {
            seq_printf(archivo, "\t\t}\n");
        } else {
            seq_printf(archivo, "\t\t},\n");
        }    	
    }
    seq_printf(archivo, "\t]\n");
    
    seq_printf(archivo, "\n}");

    return 0;
}

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

//Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

//Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("cpu_so1_1s2024", 0, NULL, &operaciones);
    printk(KERN_INFO "Henrry David Bran Velasquez\n");
    return 0;
}

//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("cpu_so1_1s2024", NULL);
    printk(KERN_INFO "Primer Semestre 2024\n");
}

module_init(_insert);
module_exit(_remove);
